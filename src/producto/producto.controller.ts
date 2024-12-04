// Archivo de controlador de producto

import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseIntPipe, UploadedFile, UseInterceptors, ForbiddenException, NotFoundException } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Public } from 'src/auth/decorators';


@ApiTags('Productos')
@ApiBearerAuth('JWT')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('producto')
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {}


  /**
   * Crea un producto, solo los ADMIN y SUPER pueden crear
   * @param dto que es del tipo CreateProductoDto
   * @returns el producto creado
   */
  @Post()
  @ApiOperation({ summary: 'Crea un producto, solo los ADMIN y SUPER pueden hacerlo' })
  @ApiResponse({ status: 201, description: 'Producto creado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @UseInterceptors(
    FileInterceptor('imagen', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const unixSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${unixSuffix}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @Roles('ADMIN', 'SUPER')
  async create(@UploadedFile() file: Express.Multer.File, @Body() dto: CreateProductoDto) {
    try {
      if (!file) {
        throw new ForbiddenException('No image uploaded');
      }
      const imagePath = `uploads/${file.filename}`;
      return await this.productoService.create({ ...dto, imagen: imagePath });
    } 
    catch (error) {
      throw new ForbiddenException(error.message || 'Error creating product');
    }
  }


  /**
   * Obtiene todos los productos, sin importar el rol
   * @returns todos los productos
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Obtiene todos los productos sin necesidad de loguearse' })
  @ApiResponse({ status: 200, description: 'Productos obtenidos' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  async findAll() {
    try {
      return await this.productoService.findAll();
    } 
    catch (error) {
      throw new ForbiddenException('Error fetching products');
    }
  }


  /**
   * Encuentra un producto por id, sin importar el rol
   * @param id el id del producto
   * @returns 
   */
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Obtiene un producto por id, sin necesidad de loguearse' })
  @ApiResponse({ status: 200, description: 'Producto obtenido' })
  @ApiResponse({ status: 403, description: 'Producto no encontrado' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const product = await this.productoService.findOne(id);
      if (!product) {
        throw new NotFoundException('Product not found');
      }
      return product;
    } 
    catch (error) {
      throw new NotFoundException(error.message || 'Error finding product');
    }
  }

  /**
   * Actualiza un producto por id, solo los SUPER pueden
   * @param id que es el id del producto
   * @param dto que es del tipo UpdateProductoDto
   * @returns el producto actualizado, siempre y cuando exista
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Actualiza un producto por id' })
  @ApiResponse({ status: 200, description: 'Producto actualizado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @Roles('SUPER')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductoDto) {
    try {
      const updatedProduct = await this.productoService.update(id, dto);
      if (!updatedProduct) {
        throw new NotFoundException('Product not found');
      }
      return updatedProduct;
    } 
    catch (error) {
      throw new NotFoundException(error.message || 'Error updating product');
    }
  }

  /**
   * Elimina un producto por id, solo los ADMIN y SUPER pueden eliminar
   * @param id que es el id del producto
   * @returns el msj de producto eliminado o producto no encontrado
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Elimina un producto por id' })
  @ApiResponse({ status: 200, description: 'Producto eliminado' })
  @ApiResponse({ status: 403, description: 'Acceso denegado' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado' })
  @Roles('ADMIN', 'SUPER')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const removedProduct = await this.productoService.remove(id);
      if (!removedProduct) {
        throw new NotFoundException('Product not found');
      }
      return { message: 'Product successfully deleted' };
    } 
    catch (error) {
      throw new NotFoundException(error.message || 'Error deleting product');
    }
  }
}