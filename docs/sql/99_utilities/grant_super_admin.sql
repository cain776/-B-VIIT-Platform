-- Grant super_admin role to the specified user
UPDATE public.profiles
SET role = 'super_admin'
WHERE email = 'cain776@gmail.com';

-- Verify the update
SELECT email, role FROM public.profiles WHERE email = 'cain776@gmail.com';
