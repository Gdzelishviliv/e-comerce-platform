import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { CreateProductInput } from './dto/create-product.dto';
import { UpdateProductInput } from './dto/update-product.dto';
import { ProductDto } from './dto/product.dto';
import { Product } from './schemas/product.schema';

@Resolver(() => Product)
export class ProductResolver {
    constructor(private readonly productService: ProductService) { }

    @Mutation(() => ProductDto)
    async createProduct(@Args('input') input: CreateProductInput): Promise<ProductDto> {
        return this.productService.create(input);
    }
    
    @Mutation(() => ProductDto)
    async addUserToPurchasedBy(
        @Args('productId') productId: string,
        @Args('userId') userId: string,
    ): Promise<ProductDto> {
        return this.productService.addUserToPurchasedBy(productId, userId);
    }

    @Query(() => [ProductDto])
    async getProducts(
        @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
        @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
        @Args('filters', { type: () => String, nullable: true }) filters?: string,
        @Args('sort', { type: () => String, nullable: true }) sort?: string,
    ): Promise<ProductDto[]> {
        return this.productService.findAll(filters, sort, page, limit);
    }

    @Query(() => ProductDto)
    async getProduct(@Args('id') id: string): Promise<ProductDto> {
        return this.productService.findOne(id);
    }

    @Mutation(() => ProductDto)
    async updateProduct(
        @Args('id') id: string,
        @Args('input') input: UpdateProductInput,
    ): Promise<ProductDto> {
        return this.productService.update(id, input);
    }

    @Mutation(() => ProductDto)
    async deleteProduct(@Args('id') id: string): Promise<ProductDto> {
        return this.productService.remove(id);
    }
}
