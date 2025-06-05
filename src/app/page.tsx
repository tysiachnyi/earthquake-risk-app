import { Header, Paragraph } from "./components";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Header text="Welcome to EQ Risk App!" />
      <Paragraph text="Discover your earthquake risk with our easy-to-use application. Get insights, tips, and resources to help you stay prepared and make informed decisions about your safety." />
    </main>
  );
}
