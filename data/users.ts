import { hashSync } from 'bcryptjs'

const userData = {
  users: [
    {
      name: 'Admin',
      email: 'admin@frontcast.ir',
      password: hashSync('12345', 10),
      role: 'admin',
    },
    {
      name: 'User',
      email: 'user@frontcast.ir',
      password: hashSync('12345', 10),
      role: 'user',
    },
  ],
}

export default userData