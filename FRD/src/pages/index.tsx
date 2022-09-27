import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { Footer } from '../components/Footer'
import { Heading } from '../components/Heading'
import { Navbar } from '../components/Navbar'
import { ProductCard } from '../components/ProductCard'

import img from '../pages/photo/banner.png'
import styles from '../styles/Home.module.css'
import { Container, Pagination, } from '@mui/material'
import home from '../styles/Index.module.css'
import ImageSlider from '../components/ImageSlider'
import { dataSlider } from '../components/DataSlider'
import Link from 'next/link'
import { useEffect, useState } from 'react'




interface Product {
	id: number,
	name: string
	icon: string

}

const Home: NextPage = () => {

	// axios.defaults.baseURL = process.env.NEXT_PUBLIC_ANALYTICS_ID;

	const [products, setProduct] = useState<Product[]>([])


	async function fetchProduct() {
		let res = await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_ID}/allProductInfo`,
			{
				method: 'GET',
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}`
					
				}
			})

		
		let product = (await res.json()).allProductInfo
		console.log(products);
		
		
		setProduct(product)
	} { }

	useEffect(() => {
		fetchProduct()
	}, [setProduct])

	// interface BigProduct {
	// 	id: number,
	// 	name: string
	// 	image1: string
	// }

	// const [bigProduct, setBigProduct] = useState<BigProduct[]>([])

	// async function fetchBigProduct() {
	// 	let res = await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_ID}/allProductInfo`)
	// 	let product = (await res.json()).allProductInfo
	// 	setBigProduct(product)
	// } { }

	// useEffect(() => {
	// 	fetchBigProduct()
	// }, [setBigProduct])


	return (
		<div>
			<Head>
				<title>Create Next App</title>
				<meta
					name='description'
					content='Generated by create next app'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Heading />
			<Navbar />
			<div>
				<ImageSlider slides={dataSlider} />
			</div>


			<Container>
				<div className={home.productCardTitle}>Featured Product</div>
				<div className={styles.productcard}>
					{products.map((product) => (
						<ProductCard
							key={product.id}
							name={product.name}
							id={product.id}
							icon={product.icon} />
					)).filter((product,k)=>k <10)}
				</div>
				{/* <div className={home.productCardTitle}>Leatest Product</div>
				<div className={styles.productcard}>
					{/* {bigProduct.map((productCard) => (
						<ProductBigCard
							key={productCard.id}
							name={productCard.name}
							image1={productCard.image1}
						/>
					))} 
				</div> */}
			</Container>
			<div className={home.bannerBox}>
				<Image className={home.banner} src={img}
					width={3000}
					height={700} />
				<div className={home.titleBox}>
					<div className={home.title} >Get Leatest Update By Subscribe<br />
						Our Newslater</div>
					<Link href="/productPage"><a className={home.button}>Shop Now</a></Link>
				</div>



			</div>
			<Footer />
		</div>
	)
}

export default Home