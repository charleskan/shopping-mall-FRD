import type { NextPage } from 'next'
import Head from 'next/head'
import { Footer } from '../components/Footer'
import { Heading } from '../components/Heading'
import { Navbar } from '../components/Navbar'
import React, { useEffect, useMemo, useState } from 'react';
import { fetchAddToCart, fetchMinusFromCart, fetchRemoveFromCart, loadCart } from '../redux/cart/action';
import { useAppSelector, useAppDispatch } from '../store';
import { LoadingState } from '../models'
import { loadOneProduct } from '../redux/product/action'
import Skeleton from 'react-loading-skeleton'
import { Container } from '@mui/material'
import home from '../styles/Index.module.css'
import cart from '../styles/Cart.module.css'
import CartItem from '../components/CartItem'
import Link from 'next/link'
import { PrintDisabled } from '@mui/icons-material'
import { useRouter } from 'next/router'
import Checkout from '../components/Checkout'


const Cart: NextPage = () => {

	const cartLoaded = useAppSelector(state => state.cart.loading)
	const carts = useAppSelector(state => state.cart.products)

	// const cartCount = useAppSelector(state => state.cart.productDetailIds)
	const dispatch = useAppDispatch()

	// useEffect(() => {
	// 	dispatch(loadCart())
	// }, [])

	const totalPrice = useMemo(() => {
		let total = carts.map((item) =>
			Number(item.product_price) * Number(item.tc_number))
			.reduce((a, b) => a + b, 0)
		// console.log('carts inside: ', carts);
		// console.log('total:', total);
		return total;
	}, [carts])

	// const [totalPrice, setTotalPrice] = useState(0)

	// const [cartItems, setCartItems] = useState<Array<CartItems>>([]);

	// useEffect(() => {
	// 	dispatch(loadCart())

	// 	JSON.parse(localStorage.getItem('cartItems')!)
	// 	// setCartItems(JSON.parse(localStorage.getItem('cartItems')!))
	// }, [totalPrice])



	// function getTotalPrice() {

	// 	let total = carts.map((item) => 
	// 	Number(item.product_price) * Number(item.tc_number))
	// 	.reduce((a, b) => a + b, 0)
	// 	console.log('carts inside: ', carts);

	// 	console.log('total:', total);

	// 	setTotalPrice(total)
	// }

	// useEffect(() => {
	// 	getTotalPrice();
	// }, [carts])



	const router = useRouter()

	return (

		<>
			<Heading />
			<Navbar />
			<Head>
				<title>Cart</title>
				<meta
					name='description'
					content='Generated by create next app'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<>
				{/* {console.log('carts:', carts)} */}
				{/* {console.log('cartLoaded:',cartLoaded ,)} */}
			</>
			<div className={cart.pageBox}>
				<Container>
					<div>
						<h1 className={cart.Title}>Cart</h1>
						<span className={cart.page}>Home. Pages.</span>
						<span className={cart.nowPage}>
							Cart
						</span>
					</div>
				</Container>
			</div>
			<Container>
				<div className={cart.box}>
					<div>
						{cartLoaded !== LoadingState.Loaded ?
							<Skeleton circle borderRadius={50} /> :
							carts.length > 0 ? carts.map(productInCart =>


								<CartItem
									key={productInCart.id}
									product={productInCart.product}
									icon={productInCart.icon}
									color={productInCart.color}
									size={productInCart.size}
									tc_number={productInCart.tc_number}
									tc_price={productInCart.tc_price}

									onMinusFromCart={() => dispatch(fetchMinusFromCart(productInCart.id)) }
									onRemoveFromCart={() => dispatch(fetchRemoveFromCart(productInCart.id))}
									onAddToCart={() => dispatch(fetchAddToCart(productInCart.id)) }

								/>

							)
								: <div className={cart.empty}>Cart is empty</div>
						}
					</div>
					{cartLoaded !== LoadingState.Loaded ?
						<Skeleton circle borderRadius={50} /> :
						<form className={cart.totalBox} >
							<div >
								<div>Total</div>
								<div className={cart.totalPrice}>{totalPrice}</div>
							</div>

						</form>
					
				}
				<Checkout/>
				</div>

			</Container>
			<Footer />
		</>
	)
}


export default Cart