const show = (component) => ({
  when: render => render && component()
})

export default show;
