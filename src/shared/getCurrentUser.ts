interface IUser {
  UsuarioClave: string,
  UsuarioNombre: string,
  UsuarioAccesoAdmin: boolean,
}

declare var __cloudUser__: IUser | undefined
export function getCurrentUser(): IUser | undefined {
  if (shouldMockApis()) {
    return {
      UsuarioClave: 'testUser@gmail.com',
      UsuarioNombre: 'testNombre',
      UsuarioAccesoAdmin: true,
    }
  }
  return __cloudUser__
}

interface IMetadata {
  Empresa: string,
  Email: string,
}

declare var __cloudMetadata__: IMetadata
export function getCurrentMetadata(): IMetadata {
  if (shouldMockApis()) {
    return {
      Empresa: 'MOCKEMPRESA',
      Email: 'MOCKEMAIL',
    }
  }
  return __cloudMetadata__
}
