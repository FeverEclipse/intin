import React from 'react'

function PostLike(props){
    return(
        <div className='flex w-full mt-2 p-2 border-1 rounded-md gap-x-3'>
            <img className='h-6 min-w-fit' src='/assets/Like_Notification.png'></img>
            <div className='min-w-fit'>
                <h1 className='text-lg font-inter'>Yeni Beğeni!</h1>
                <p className='font-inter_regular'>@{props.notification.username}, gönderini beğendi.</p>
            </div>
            <div className='w-full'></div>
            <p className='min-w-fit text-sm'>{props.date}</p>
        </div>
    )
}

function ReplyLike(props){
    return(
        <div className='flex w-full mt-2 p-2 border-1 rounded-md gap-x-3'>
            <img className='h-6 min-w-fit' src='/assets/Like_Notification.png'></img>
            <div className='min-w-fit'>
                <h1 className='text-lg font-inter'>Yeni Beğeni!</h1>
                <p className='font-inter_regular'>@{props.notification.username}, yanıtını beğendi.</p>
            </div>
            <div className='w-full'></div>
            <p className='min-w-fit text-sm'>{props.date}</p>
        </div>
    )
}

function NewReply(props){
    return(
        <div className='flex w-full mt-2 p-2 pt-3 border-1 rounded-md gap-x-3'>
            <img className='w-6 h-6 min-w-fit' src='/assets/Reply.png'></img>
            <div className='min-w-fit'>
                <h1 className='text-lg font-inter'>Yeni Yanıt!</h1>
                <p className='font-inter_regular'>@{props.notification.username}, gönderini yanıtladı.</p>
            </div>
            <div className='w-full'></div>
            <p className='min-w-fit text-sm'>{props.date}</p>
        </div>
    )
}

function NotificationCell(props) {
    let jsDate = new Date(props.notification.date);

      // Date nesnesinin metotlarını kullanarak istediğiniz formatta bir karakter dizisi oluşturun
      let formattedDate = jsDate.getDate () + "." + (jsDate.getMonth () + 1) + "." + jsDate.getFullYear () + " " + jsDate.getHours () + ":" + jsDate.getMinutes (); 
  return (
    <div>
        {props.notification.type === 1 && <PostLike notification= {props.notification} date={formattedDate}/>}
        {props.notification.type === 2 && <ReplyLike notification= {props.notification} date={formattedDate}/>}
        {props.notification.type === 3 && <NewReply notification= {props.notification} date={formattedDate}/>}
    </div>
  )
}

export default NotificationCell