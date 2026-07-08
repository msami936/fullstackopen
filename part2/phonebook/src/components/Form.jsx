export const Button = (props) => (
    <button
      type={props.type}
      onClick={props.onClick}>
      {props.text}
    </button>
  )
  
  export const Input = (props) => (
    <p>
      {props.text}
      <input
        value={props.value}
        onChange={props.onChange} />
    </p>
  )
  
  export const Form = (props) => {
    return (
      <form onSubmit={props.onSubmit}>
        <Input text='name: ' value={props.valueName} onChange={props.onNameChange} />
        <Input text='number: ' value={props.valueNumber} onChange={props.onNumberChange} />
        <Button type='submit' text={props.buttonText} />
      </form>)
  }
  