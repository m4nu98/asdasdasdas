import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });

  if (session) {
    res.status(200).json({ message: 'Already logged in' });
  } else {
    // Implement your login logic here
    res.status(200).json({ message: 'Login route' });
  }
};
