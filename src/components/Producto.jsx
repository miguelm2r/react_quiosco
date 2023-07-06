import React from 'react'
import { formatearDinero } from '../helpers'
import useQuiosco from '../hooks/useQuiosco'

export default function Producto({producto, botonAgregar = false, botonDisponible = false}) {
    const {nombre, precio, imagen, categoria} = producto
    const { handleClickModal, handleSetProducto, handleClickProductoAgotado } = useQuiosco();
  return (
    <>
        <div className='border p-3 shadow bg-white'>
            <img
                className='w-full'
                alt={`Imagen ${nombre}`}
                src={`/img/${imagen}.jpg`}
            />

            <div className='p-5'>
                <h3 className='text-2xl font-bold'>{nombre}</h3>
                <p className='mt-5 font-black text-4xl text-amber-500'>{formatearDinero(precio)}</p>
                {botonAgregar && (
                    <button
                        type='button'
                        className='bg-indigo-600 hover:bg-indigo-800 text-white mt-5 w-full p-3 uppercase font-bold'
                        onClick={() => {
                            handleClickModal();
                            handleSetProducto(producto);
                        }}
                    >
                        Agregar
                    </button>

                )}

                {botonDisponible && (
                    <button
                        type='button'
                        className='bg-indigo-600 hover:bg-indigo-800 text-white mt-5 w-full p-3 uppercase font-bold'
                        onClick={() => {
                            handleClickProductoAgotado(producto.id)
                        }}
                    >
                        Producto Agotado
                    </button>

                )}

            </div>
        </div>
    </>
  )
}
