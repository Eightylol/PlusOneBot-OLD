$(function() {
  let btn_servers = $('#btn_servers'),
      btn_sign_out = $('#btn_sign_out')

  btn_servers.on('click',function(e) {
    alert("Clicked Servers button")
  })
  btn_sign_out.on('click', function(e) {
    alert("Clicked Sign out button")
  })
})
