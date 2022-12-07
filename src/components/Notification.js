const Notification = ({ message }) => {
  if (message) {
    return (
      <div className={message.type}>
        {message.text}
      </div>
    )
  }

  return null
}

export default Notification