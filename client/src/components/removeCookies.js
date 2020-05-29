 
import React, { useEffect } from 'react';
import { useCookies } from 'react-cookie'

const RemoveCookies = ({}) => {
  const [cookies, setCookie, removeCookie] = useCookies(null)
  useEffect(() => {
    window.removeCookie = removeCookie("guest_cart")
  }, [])
  return (
    <></>
  );
}
export default RemoveCookies
