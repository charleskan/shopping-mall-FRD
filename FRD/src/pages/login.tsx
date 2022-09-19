import type { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { Footer } from '../components/Footer'
import { Heading } from '../components/Heading'
import { Navbar } from '../components/Navbar'
import loginStyles from '../styles/Login.module.css'
import { loggedIn } from '../redux/auth/action'
import { useDispatch } from 'react-redux'

const login: NextPage = () => {
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const dispatch = useDispatch()
	const router = useRouter()

	return (
		<div>
			<Heading />
			<Navbar />
			<Head>
				<title>Create Next App</title>
				<meta
					name='description'
					content='Generated by create next app'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<div className={loginStyles.loginBox}>
				<form
					className={loginStyles.loginForm}
					action='/send-data-here'
					method='post'
					onSubmit={async (e) => {
						e.preventDefault()
						const res = await fetch(
							`${process.env.NEXT_PUBLIC_ANALYTICS_ID}/login`,
							{
								method: 'POST',
								headers: { 'Content-Type': 'application/json' },
								body: JSON.stringify({ username, password })
							}
						)
						if (res.status === 200) {
							const user = await res.json()

							localStorage.setItem('token', user.token)
							localStorage.setItem('username', user.user.username)
							dispatch(loggedIn())
							router.push('/')
						} else if (res.status === 400) {
							setError('Password Error')
						} else if (res.status === 404) {
							setError('Not Firm you')
						}
					}}>
					{error}
					<div className={loginStyles.loginWork}>Login</div>
					<div className={loginStyles.loginCommet}>
						Please login using account detail bellow.
					</div>
					<input
						className={loginStyles.textBox}
						type='text'
						id='username'
						name='first'
						placeholder='Email Address'
						value={username}
						onChange={(e) => setUsername(e.currentTarget.value)}
					/>
					<input
						className={loginStyles.textBox}
						type='text'
						id='last'
						name='last'
						placeholder='Password'
						value={password}
						onChange={(e) => setPassword(e.currentTarget.value)}
					/>
					<button className={loginStyles.button} type='submit'>
						Sign In
					</button>
					<Link href='/Register'>
						<p className={loginStyles.loginRegister}>
							Don't have Account ? Create account
						</p>
					</Link>
				</form>
			</div>
			<Footer />
		</div>
	)
}

export default login