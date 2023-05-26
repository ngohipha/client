import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

//create the api

export const appApi = createApi({
  reducerPath: "appApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (user) => ({
        url: "/users/signup",
        method: "POST",
        body: user,
      }),
    }),
    login: builder.mutation({
      query: (user) => ({
        url: "/users/login",
        method: "POST",
        body: user,
      }),
    }),
    // creating product 
    createProduct: builder.mutation({
      query: (product)=>({
        url: "/products",
        body: product,
        method: "POST"
      })
    }),
    // ad to cart
    addToCart : builder.mutation({
      query : (cartInfo) => ({
        url: "/products/add-to-cart",
        body: cartInfo,
        method: "POST"
      })
    }), 
    // remove from cart
      removeFromCart : builder.mutation({
      query : (body) => ({
        url: "/products/remove-from-cart",
        body,
        method: "POST"
      })
    }), 
    //delete product 
    deleteProduct : builder.mutation({
      query : ({product_id ,user_id}) => ({
        url: `/prodycts/${product_id}`,
        body: {
          user_id
        },
        method: "DELETE"
      })
    }), 
    // update product
    updateProduct : builder.mutation({
      query : (product) => ({
        url: `/prodycts/${product.id}`,
        body: product,
        method: "PATCH"
      })
    }), 
    // increase cart 
    increaseCartProduct : builder.mutation({
      query : (body) => ({
        url: "/products/increase-cart",
        body,
        method: "POST"
      })
    }), 
    // decrease cart 
    decreaseCartProduct: builder.mutation({
      query : (body) => ({
        url: "/products/decrease-cart",
        body,
        method: "POST"
      })
    }), 
    // create order 
    createOrder: builder.mutation({
      query : (body) => ({
        url: "/orders",
        body,
        method: "POST"
      })
    }), 
    forgotPassword:builder.mutation({
      query: (body)=>({
        url: 'users/forgotpassword',
        method: "POST",
        body,
      })
    }),
    resetPassword:builder.mutation({
      query: (body)=>({
        url: 'users/resetpassword/',
        method: "PATCH",
        body,
      })
    }),
    
  }),
});


export const {useSignupMutation , useLoginMutation, useCreateProductMutation , useAddToCartMutation,useDecreaseCartProductMutation,useIncreaseCartProductMutation,useRemoveFromCartMutation,useCreateOrderMutation , useDeleteProductMutation,useUpdateProductMutation ,useForgotPasswordMutation,useResetPasswordMutation  } = appApi

export default appApi;