declare module 'swiper/modules' {
  const Navigation: any
  const Thumbs: any
  const Pagination: any
  const A11y: any
  const Autoplay: any
  export { Navigation, Thumbs, Pagination, A11y, Autoplay }
}

declare module 'swiper/modules/*' {
  const m: any
  export default m
}
declare module 'swiper/modules/*' {
  const m: any
  export default m
}

declare module 'swiper/modules' {
  const m: any
  export = m
}
