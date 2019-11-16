import sweetalert2 from 'sweetalert2'


export async function errorDialog(title: string) {
  await sweetalert2({
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