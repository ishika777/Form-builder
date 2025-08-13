import React from 'react'
import { Link } from 'react-router-dom'

const Sidebar = () => {



    return (
        <div className='flex flex-col items-center gap-2 w-full'>

            <Link to="/">
                Dash
            </Link>
            <Link to={`/form/edit/${"sdfdsf"}`}>
                Edit
            </Link>
            <Link to={`/form/preview/${"sdfdsf"}`}>
                Preview
            </Link>
            <Link to={`/form/fill/${"sdfdsf"}`}>
                Fill
            </Link>

        </div>
    )
}

export default Sidebar