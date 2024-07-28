const express = require('express')
import { Request, Response } from 'express';
const {mailer} = require('./nodemailerConfig.js')
const {PrismaClient} = require('@prisma/client')
const bcrypt = require('bcrypt')
const {faker}  = require('@faker-js/faker')

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

async function main() {
  await prisma.$connect()
  console.log("Connected to database!")

  const allUsers = await prisma.user.findMany()
  console.log(allUsers)

  await prisma.$disconnect()
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

app.post('/signup', async (req : Request, res : Response) => {
    try{
      const {email,password,name} = req.body
      const salt = await bcrypt.genSalt(10); 
      const hashedPassword = await bcrypt.hash(password, salt);
      const randomOTP = Math.floor(100000 + Math.random()*900000);
      const result = await prisma.user.create({
        data: { ...req.body, password:hashedPassword, otp:randomOTP },
        select: { id: true, email: true, name: true} 
      })
      if (!result) {
         res.status(500).json({message: 'User not found! Please register'})
      }
      mailer(email, 'Ecommerce OTP', `Welcome ${name} your otp is: ${randomOTP}`)
      res.status(200).json({message: 'registered successfull', user: result})
    } catch(error) {
      console.log(error)
      res.status(500).json({message: error})
    }
})

app.post(`/verify`, async (req: Request,res: Response) => {
  try{
    const {email, otp} = req.body
    const user = await prisma.user.findUnique({
      where: { email },
    }); 
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
    }
    if (parseInt(user.otp) !== parseInt(otp)) {
      console.log(user.otp , otp)
      res.status(400).json({ message: 'Invalid OTP' });
    }
    const updateData = await prisma.user.update({
      where: { email },
      data: { otp: null, isVerified: true },
      select: { id: true, email: true, name: true}
    });
    res.status(200).json({ message: 'Verification successful', user: updateData });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong',error});
    }
})
app.post(`/login`, async (req: Request,res: Response) => {
  try{
    const {email, password} = req.body
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        selectedInterests: true,
      },
    }); 
    if (!user) {
       res.status(400).json({ message: 'Invalid email address' });
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      res.status(400).json({ message: 'Invalid password' });
    }
    const updateUser = await prisma.user.findUnique({
      where: {email},
      select: { id: true, email: true, name: true, isVerified: true, selectedInterests: true} 
  });
    res.status(200).json({ message: 'Logged in successfully', user: updateUser });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong',error});
}
})

app.get('/interests', async (req: Request, res: Response) => {
  try{
    const interests = await prisma.Interests.findMany()  
    if (!interests) {
      res.status(500).json({message: 'No interest found'})
    }
    res.status(200).json({message: 'All interest fetched',interests:interests})

  } catch (error) {
    res.status(500).json({error})
  }
})

//app.post('/interests', async (req: Request, res: Response) => {
// const interests= Array.from({ length: 150 }, () => ({
//     name: faker.commerce.department(),
//   }));

//   await prisma.interests.createMany({
//     data: interests,
//   });
//  })

app.get(`/user/:id`, async (req: Request, res: Response) => {
  const {id} = req.params

  try{
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {name:true, email: true, selectedInterests: true}
    })
      if (!user) {
        res.status(400).json({ message: 'Invalid user' });
      }
      res.status(200).json( {message: 'User fetched successfully', user:user})
  }
  catch(err){
    res.status(500).json({error:err,message: "Something went wrong"})
  }
})

app.put('/user/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { selectedInterests } = req.body; 

  try {
    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: { selectedInterests: { set: selectedInterests.map((interestId: number) => ({ id: interestId })) } },
      include: {
        selectedInterests: true
      }}
    );
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
  app.listen(9000, () =>
    console.log('REST API server ready at: http://localhost:9000'),
  )