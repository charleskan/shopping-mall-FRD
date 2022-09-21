import { Knex } from "knex"
import { Invoice } from '../models'
import { Invoice_product } from '../models'

export class InsertRejectError extends Error {
    constructor(msg?: string) {
        super(msg)
        Object.setPrototypeOf(this, InsertRejectError.prototype)
    }
}

export class InvoiceService {
    constructor(private knex: Knex) { }

    // -------------------------------------------------------------------------------------------------------------------
    // get Invoice Info by userId
    // -------------------------------------------------------------------------------------------------------------------
    async getInvoiceDetailByUserId(userId: number, status_id: number) {

        let invoiceRecord = await this.knex
            .raw
            (/* SQL */
                `
            select *
            from "invoice"
            where "user_id" = ?
            and "status_id" = ?
            order by "invoiceNumber" desc
            `
                , [userId, status_id]
            )

        return invoiceRecord.rows

    }

    // -------------------------------------------------------------------------------------------------------------------
    // get the next invoice number
    // -------------------------------------------------------------------------------------------------------------------
    // async getInvoiceLargestNumber() {


    //     const isolationLevel = "serializable";
    //     const trx = await this.knex.transaction({ isolationLevel })


    //     try {
    //         const invoiceLargestNumber = await trx
    //         .select('invoiceNumber', 'id')
    //         .from('invoice')
    //         .orderBy('invoiceNumber', 'desc')
    //         .limit(1)
    //         .returning('invoiceNumber')

    //         const invoiceLargestNumberString = invoiceLargestNumber[0].invoiceNumber//expect 'ABC003'
    //         const invoiceLargestNumberNumber = Number(invoiceLargestNumberString.substring(3, invoiceLargestNumberString.length))//3
    //         const invoiceLargestNumberNextNumber = invoiceLargestNumberNumber + 1 //4
    //         const invoiceLargestNumberNextString = 'ABC00' + invoiceLargestNumberNextNumber.toString() //'ABC004'

    //         await trx.commit()
    //         return invoiceLargestNumberNextString

    //     } catch (error) {
    //         await trx.rollback()
    //         await fail()
    //         throw new GetInvoiceLargestNumberError()

    //     }

    // }

    // -------------------------------------------------------------------------------------------------------------------
    // create invoice
    // -------------------------------------------------------------------------------------------------------------------
    async createInvoice(

        status_id: number, // always 1
        user_id: number,
        address_id: number,

    ) {
        const isolationLevel = 'serializable';
        const trx = await this.knex.transaction({ isolationLevel });
        try {
            //get the next invoice number
            const invoiceLargestNumber = await trx
                .select('invoiceNumber', 'id')
                .from('invoice')
                .orderBy('invoiceNumber', 'desc')
                .limit(1)
                .returning('invoiceNumber')

            const invoiceLargestNumberString = invoiceLargestNumber[0].invoiceNumber//expect 'ABC003'
            const invoiceLargestNumberNumber = Number(
                invoiceLargestNumberString
                    .substring(3, invoiceLargestNumberString.length))
            //3
            const invoiceLargestNumberNextNumber = invoiceLargestNumberNumber + 1 //4
            const invoiceLargestNumberNextString = 'ABC00' + invoiceLargestNumberNextNumber.toString() //'ABC004'

            //insert
            const invoiceRecord = await trx
                .insert({
                    invoiceNumber: invoiceLargestNumberNextString,
                    status_id: status_id,
                    user_id: user_id,
                    address_id: address_id,
                    totalPrice: 0
                })
                .from('invoice')
                .returning('*')

            await trx.commit()

            return invoiceRecord

        } catch (error) {
            await trx.rollback()
            throw new InsertRejectError()
        }
    }




    // -------------------------------------------------------------------------------------------------------------------
    // update invoice
    // -------------------------------------------------------------------------------------------------------------------
    async updateInvoice(id: number, invoiceNumber: string, status_id: number, user_id: number, address_id: number, totalPrice: number) {

        {


            let invoiceRecord = await this.knex<Invoice>('invoice')

                .update({
                    invoiceNumber: invoiceNumber,
                    status_id: status_id,
                    user_id: user_id,
                    address_id: address_id,
                    totalPrice: totalPrice
                })
                .where('id', id)
                .returning('*')

            return invoiceRecord
        }

    }
    // -------------------------------------------------------------------------------------------------------------------
    // delete Invoice
    // -------------------------------------------------------------------------------------------------------------------

    async deleteInvoice(id: number) {

        {

            let invoiceRecord = await this.knex<Invoice>('invoice')


                .update({
                    status_id: 3
                })
                .where('id', id)
                .returning('*')


            return invoiceRecord
        }

    }

    // -------------------------------------------------------------------------------------------------------------------
    // add product to cart 
    // -------------------------------------------------------------------------------------------------------------------

    async addProductToCart(
        invoice_id: number,
        productDetail_id: number,
        number: number,
        price: number,

    ) {

        {
            //insert
            let productToCartRecord = await this.knex<Invoice_product>('invoice_productDetail')

                .insert({
                    invoice_id: invoice_id,
                    productDetail_id: productDetail_id,
                    number: number,
                    price: price
                })
                .returning('*')

            return productToCartRecord

        }

    }
    // -------------------------------------------------------------------------------------------------------------------
    // get all product in cart 
    // -------------------------------------------------------------------------------------------------------------------

    async getAllProductInCart(invoiceId: number) {

        {

            const productInCartRecord = await this.knex
                .raw
                (
                    /* SQL */
                    `
                    with
                    product_detail as
                    (
                    select 
                    pd.id,
                    p.name as product,
                    c."name" as color,
                    s.name as size,
                    price as productPrice,
                    stock,
                    s2.name as status,
                    icon
                    from 
                    ((("productDetail" pd 
                    inner join product p on p.id = pd.product_id)
                    inner join color c on c.id=pd.color_id)
                    inner join "size" s on s.id = pd.size_id )
                    inner join status s2 on s2.id = pd.status_id 
                    )
                    
                    select
                    product, 
                    color, 
                    "size", 
                    icon, 
              		"product_detail".id,
                    sum("number") as TC_Number, 
                    sum(productPrice) as TC_Price
                    from product_detail 
                    inner join
                    "invoice_productDetail" ipd on ipd."productDetail_id" = product_detail.id
                    where "invoice_id" = ?
                    group by 
                    product, 
                    color, 
                    "size", 
                    icon,
                    "product_detail".id,
                    productPrice
                    
                    `,
                    [invoiceId]
                )


            return productInCartRecord.rows
        }

    }
    // -------------------------------------------------------------------------------------------------------------------
    // delete product from cart ✅
    // -------------------------------------------------------------------------------------------------------------------

    // -------------------------------------------------------------------------------------------------------------------
    // delete product from cart ✅
    // -------------------------------------------------------------------------------------------------------------------
    async deleteProductFromCart(invoiceId: number, deleteFromCartProductId: number) {
        {
            // const deleteRecordInvoice = await this.knex('invoice_productDetail')
            //     .where('product_id', deleteFromCartProductId)
            //     .andWhere('invoice_id', invoiceId)
            //     .del()
            //     .returning('*')

            const deleteRecordInvoice = await this.knex
                .raw
                (
                    /* SQL */
                    `
                    delete
                    from "invoice_productDetail"
                    where "productDetail_id" = ?
                    and "invoice_id" = ?
                    returning *
                    `,
                    [
                        deleteFromCartProductId,
                        invoiceId,
                    ]
                )

            return deleteRecordInvoice
        }
    }
    // -------------------------------------------------------------------------------------------------------------------
    // check freebie in cart
    // -------------------------------------------------------------------------------------------------------------------

    async checkFreebieInCart(invoiceId: number) {

        {
            const FreebieInCart = await this.knex
                .raw(
                    `
                    WITH suckSQL as
                    (
                    select *
                    FROM invoice_product
                    where invoice_id = ?
                    ),
                    
                    
                    productInCartDetail as 
                    (
                    select sum(price) as sum_of_Price, 
                    product_id,
                    invoice_id,
                    sum(number) as sum_of_Number
                    from suckSQL
                    group by product_id, invoice_id
                    ),
                    
                    
                    fkSQL as 
                    (
                    select *
                    from productInCartDetail
                    ),
                    
                    
                    freebie_final as 
                    (
                    select * from fkSQL 
                    inner join promotion_product pp 
                    on fkSQL.product_id = pp.product_id
                    )
                    
                    select invoice_id,
                    (DIV(sum_of_number, product_number) * freebie_number) as 
                    number_of_freebie, name, freebie_id, image 
                    from freebie_final 
                    inner join product p 
                    on p.id = freebie_final.freebie_id
                    where (DIV(sum_of_number, product_number) * freebie_number) != 0
                `,
                    [invoiceId]
                )

            return FreebieInCart;
        }
    }

    // -------------------------------------------------------------------------------------------------------------------
    // get total price from invoice_product table
    // -------------------------------------------------------------------------------------------------------------------

    async getTotalPrice(invoiceId: number) {

        {

            const getTotalPrice = await this.knex
                .raw
                (
                    `
                    WITH Cart as
                    (
                    select *
                    FROM "invoice_productDetail" ipd
                    where invoice_id = ?
                    ),
                    
                    productInCart as 
                    (
                    select sum(price) as sum_of_Price, 
                    "productDetail_id",
                    invoice_id,
                    sum(number) as sum_of_Number
                    from Cart
                    group by "productDetail_id", invoice_id
                    )
                    
                    
                    select 
                    invoice_id, SUM(sum_of_price) as total_price
                    from productInCart
                    inner join product 
                    on product.id = productInCart."productDetail_id"
                    group by invoice_id
                        `,
                    [invoiceId]
                )


            return getTotalPrice
        }

    }

    // -------------------------------------------------------------------------------------------------------------------
    // update number of product in cart
    // -------------------------------------------------------------------------------------------------------------------

    async minusProductInCart(invoiceId: number, minusProductInCartId: number) {
        {
            const deleteNumberProductRecord = await this.knex
                .raw
                (
                    `
                with Cart as
			   (
               select * 
               from invoice_product
               where invoice_id = ?
               and product_id = ?
               )
               
             delete 
             from invoice_product where id=(select max(id) from Cart)
             returning *
            
             `,
                    [invoiceId,
                        minusProductInCartId]
                )


            return deleteNumberProductRecord
        }
    }

    // -------------------------------------------------------------------------------------------------------------------
    // get product price by id
    // -------------------------------------------------------------------------------------------------------------------
    async getSingleProductDetail(
        productId: number,
        colorId: number,
        sizeId: number,
    ) {
        const isolationLevel = 'serializable';
        const trx = await this.knex.transaction({ isolationLevel });
        try {
            const getProductPrice = await trx
                .raw
                (/* SQL */
                    `
                    select *
                    from "productDetail" 
                    where "product_id" = ?
                    and "color_id" = ?
                    and "size_id" = ?
                    `
                    , [productId, colorId, sizeId]
                )
            // console.log('getProductPrice: ', getProductPrice.rows[0]);
            await trx.commit()

            return getProductPrice.rows[0]
        } catch (error) {
            await trx.rollback();
            throw new InsertRejectError()
        }


    }
}