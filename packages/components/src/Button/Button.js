import React from 'react'
import styled from 'react-emotion'

type PropTypes = {
  color: string
}

const Button = styled.button`
  border: red;
  color: ${({ color }) => color};
`

export default (props: PropTypes) => <Button {...props} />
