import { Title } from "@solidjs/meta";
import { css } from "~/styled-system/css";


export default function Home() {

  return (
    <main class={css({bg: 'red.500'})}>
      <Title>Hello World111</Title>
    </main>
  );
}
