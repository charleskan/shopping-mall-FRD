import cart from '../styles/Cart.module.css'
import Image from 'next/image'
import CancelIcon from '@mui/icons-material/Cancel';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
interface Props {
	product: string
	icon: string
	color: string
	size: string
	tc_price: number
	tc_number: string
}

function CartItem(props: Props) {
	return (

			<div className={cart.cartBox}>
				<Image
					src={`${process.env.NEXT_PUBLIC_ANALYTICS_ID}/userUploadedFiles/${props.icon}`}
					width={100}
					height={100}
				/>
				<div className={cart.icon}>{props.product}</div>
				<div className={cart.icon}> {props.color}</div>
				<div className={cart.icon}> {props.size}</div>
        <div className={cart.qty}>
       <button className={cart.button}> <RemoveCircleIcon/></button>
				<div className={cart.icon}> {props.tc_number}</div>
        <button className={cart.button}> <AddCircleIcon/></button>
        </div>
				<div className={cart.icon}>${props.tc_price}</div>
        <button className={cart.button}><CancelIcon/></button>
			</div>
	
	)
}

export default CartItem
