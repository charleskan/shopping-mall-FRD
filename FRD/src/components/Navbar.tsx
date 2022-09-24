import Link from 'next/link'
import Image from 'next/image'
import SearchIcon from '@mui/icons-material/Search'
import navbar from '../styles/Navbar.module.css'
import img from '../components/Hektologo.png'



export function Navbar() {
	return (
		<div className={navbar.bar}>
			<div className={navbar.clickPage}>
				<div>
					<Image src={img} className={navbar.logo} />
				</div>

				<div className={navbar.page}>

					<Link href='/'>
						<a className={navbar.pages}>Home</a>
					</Link>

					<Link href='/productPage'>
						<a className={navbar.pages}>Products</a>
					</Link>

					<Link href='/AboutUs'>
						<a className={navbar.pages}>AboutUS</a>
					</Link>

					<Link href='/ContactUs'>
						<a className={navbar.pages}>Contact</a>
					</Link>

					<Link href='/Cart'>
						<a className={navbar.pages}>Cart</a>
					</Link>

					
				</div>
			</div>

			<form
				className={navbar.form}
				action='/send-data-here'
				method='post'>
				<input
					className={navbar.search}
					type='text'
					id='last'
					name='last'
				/>
				<button className={navbar.searchButton} type='submit'>
					<SearchIcon />
				</button>
			</form>

			
		</div>
		
	)
}
