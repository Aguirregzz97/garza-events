import sweetalert2 from 'sweetalert2'

export async function errorDialog(title: string) {
  await sweetalert2({
    position: 'center',
    type: 'error',
    title: title,
  })
}

export async function successDialog(title : string) {
  await sweetalert2({
    type: 'success',
    title: title,
  })
}

export async function successLogin(title : string) {
  await sweetalert2({
    position: 'center',
    type: 'success',
    showConfirmButton: false,
    timer: 1000,
    title: title,
  })
}