import { prisma } from '../lib/prisma'


import userData from './users'

async function main() {
  await prisma.product.deleteMany()

  await prisma.account.deleteMany()
  await prisma.session.deleteMany()
  await prisma.verificationToken.deleteMany()
  await prisma.user.deleteMany()

  await prisma.user.createMany({ data: userData.users })

  console.log('Data added.')
}

main()