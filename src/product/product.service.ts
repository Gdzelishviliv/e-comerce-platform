import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductInput } from './dto/create-product.dto';
import { UpdateProductInput } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';

@Injectable()
export class ProductService {
    constructor(
        @InjectModel(Product.name) private readonly productModel: Model<ProductDocument>,
    ) { }

    async addUserToPurchasedBy(productId: string, userId: string): Promise<ProductDto> {
        const updatedProduct = await this.productModel.findByIdAndUpdate(
            productId,
            { $addToSet: { purchasedBy: userId } },
            { new: true }
        ).populate('purchasedBy').exec();

        if (!updatedProduct) {
            throw new NotFoundException(`Product with ID ${productId} not found`);
        }

        return this.mapToProductDto(updatedProduct);
    }

    async getProductWithUsers(id: string): Promise<ProductDto> {
        const product = await this.productModel
            .findById(id)
            .populate('purchasedBy')
            .exec();

        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return this.mapToProductDto(product);
    }

    async create(input: CreateProductInput): Promise<ProductDto> {
        const createdProduct = new this.productModel(input);
        await createdProduct.save();
        return this.mapToProductDto(createdProduct);
    }

    async findAll(
        filters: any,
        sort: any,
        page: number,
        limit: number,
    ): Promise<ProductDto[]> {
        const products = await this.productModel
            .find(filters)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('purchasedBy')
            .exec();
        return products.map(product => this.mapToProductDto(product));
    }

    async findOne(id: string): Promise<ProductDto> {
        const product = await this.productModel.findById(id).populate('purchasedBy').exec();
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return this.mapToProductDto(product);
    }

    async update(id: string, updateProductInput: UpdateProductInput): Promise<ProductDto> {
        const updatedProduct = await this.productModel.findByIdAndUpdate(
            id,
            updateProductInput,
            { new: true }
        ).populate('purchasedBy').exec();

        if (!updatedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        return this.mapToProductDto(updatedProduct);
    }

    async remove(id: string): Promise<ProductDto> {
        const deletedProduct = await this.productModel.findByIdAndDelete(id).populate('purchasedBy').exec();  // Populate purchasedBy
        if (!deletedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return this.mapToProductDto(deletedProduct);
    }

    private mapToProductDto(product: ProductDocument): ProductDto {
        return {
            id: product._id.toString(),
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            isActive: product.isActive,
            purchasedBy: product.purchasedBy.map(user => ({
                id: user._id.toString(),
                username: user.username,
                email: user.email,
                isActive: user.isActive,
            })),
        };
    }
}
