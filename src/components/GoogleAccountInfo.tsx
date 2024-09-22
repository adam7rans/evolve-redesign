import Image from 'next/image';

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

interface GoogleAccountInfoProps {
  user: GoogleUser;
}

export default function GoogleAccountInfo({ user }: GoogleAccountInfoProps) {
  return (
    <div className="flex items-center">
      <Image
        src={user.picture}
        alt={user.name}
        width={40}
        height={40}
        className="rounded-full mr-4"
      />
      <div>
        <p className="font-semibold">{user.name}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>
    </div>
  );
}