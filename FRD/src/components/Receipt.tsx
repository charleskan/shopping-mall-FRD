import Image from 'next/image'
import invoice from '../styles/Invoice.module.css'

interface Props {
	id: number
	invoiceNumber: string
	status_id: string
	user_id: string
	address_id: string
	totalPrice: any
	product: string
	icon: string
	color: string
	size: string
	number: number
}

export function Invoice(props: Props) {
	return (
		<div>
			<div className={invoice.text}>Product :{props.product}</div>
			<Image
				src={`${process.env.NEXT_PUBLIC_ANALYTICS_ID}/userUploadedFiles/${props.icon}`}
				width={200}
				height={200}
			/>
			<div className={invoice.text}>Color:{props.color}</div>
			<div className={invoice.text}>Size:{props.size}</div>
			<div className={invoice.line}></div>
		</div>
	)
}
