import axios from "axios";
import router from "next/router";
import { AppDispatch } from "../../store"
import { checkResponse, loggedIn, logIn } from "../auth/action"


export function loadedCart(products: any) {
    return {
        type: '@@cart/LOADED_CART' as const,
        products
    }
}

export function addToCart(productId: number) {
    return {
        type: '@@cart/ADD_TO_CART' as const,
        productId,
    }
}

export function minusFromCart(productId: number) {
    return {
        type: '@@cart/MINUS_FROM_CART' as const,
        productId
    }
}

export function removeFromCart(products: []) {
    return {
        type: '@@cart/REMOVE_FROM_CART' as const,
        products
    }
}



type LoadedCartAction = ReturnType<typeof loadedCart>
type AddToCartAction = ReturnType<typeof addToCart>
type MinusToCartAction = ReturnType<typeof minusFromCart>
type RemoveToCartAction = ReturnType<typeof removeFromCart>

// export type CartActions = LoadedCartAction | AddToCartAction 
export type CartActions = LoadedCartAction | AddToCartAction | MinusToCartAction | RemoveToCartAction

export function loadCart() {
    return async (dispatch: AppDispatch) => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_ID}/cart`,
                {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
            const data = await res.json()
            console.log("data: ",data)
            

            if (res.status === 401) {
                dispatch(logIn(data))
                // dispatch(checkResponse(data))
                
            } else {
                dispatch(loadedCart(data.productRecord))
            }
            
            localStorage.setItem('cartItems', JSON.stringify(data.productRecord));

            
            
        } catch {
            dispatch(loadCart())
        }

    }
}

export   function fetchAddToCart(
    productId: number,
) {
    return async (dispatch: AppDispatch) => {
        dispatch(addToCart
            (
            productId,
            ))

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_ID}/cart/${productId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        productId,
                    })
                })

            const data = await res.json()
            
            if (res.status === 401) {
                dispatch(logIn(data))
            }
            dispatch(loadCart())
            
        } catch (e) {
            dispatch(loadCart())
        }
    }
}

export function fetchMinusFromCart(
    productId: number,
) {
    return async (dispatch: AppDispatch) => {
        dispatch(minusFromCart
            (
            productId,
            ))

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_ID}/minusProductInCart/${productId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        productId,
                    })
                })
                // console.log(res);
                
            const data = await res.json()

            if (res.status === 401) {
                dispatch(logIn(data))
            }
            dispatch(loadCart())
            
        } catch (e) {
            dispatch(loadCart())
        }
    }
}
export function fetchRemoveFromCart(
    productId: any,
) {
    return async (dispatch: AppDispatch) => {
        dispatch(removeFromCart
            (
                productId,
            ))

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_ID}/cart/${productId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        productId,
                    })
                })
                console.log(res);
                
            const data = await res.json()

            if (res.status === 401) {
                dispatch(logIn(data))
            }
            dispatch(loadCart())

        } catch (e) {
            dispatch(loadCart())
        }
    }
}

