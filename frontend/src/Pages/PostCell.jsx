import React from 'react'
import { Link } from 'react-router-dom'

function PostCell(props) {
  let jsDate = new Date(props.date);

      // Date nesnesinin metotlarını kullanarak istediğiniz formatta bir karakter dizisi oluşturun
  let formattedDate = jsDate.getDate () + "." + (jsDate.getMonth () + 1) + "." + jsDate.getFullYear () + " " + jsDate.getHours () + ":" + jsDate.getMinutes ();
  return (
    <div>
      <Link className='text-black' to={"/posts/" + props.idEntry}>
      <button type='button' className='p-2 mt-2 border-onyx w-full text-left'>
        <h1 className='font-inter text-lg'>{props.title}</h1>
        <p className='font-inter_regular'>{props.content}</p>
        <div className='flex gap-2'>
        <p className='font-inter_regular text-sm'>{formattedDate}</p>
        <div className="w-0.5 h-4 bg-black rounded-full"></div>
        <p className='font-inter_regular text-sm'>{props.username} tarafından soruldu.</p>
        </div>
        
    </button>
      </Link>
      
    </div>
    
  )
}

export default PostCell