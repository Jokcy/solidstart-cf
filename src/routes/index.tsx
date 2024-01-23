import { Title } from "@solidjs/meta";
import Counter from "~/components/Counter";
import { css } from "../../styled-system/css";
import { createResource } from "solid-js";

function delay(): Promise<string> {
  'use server';

  return new Promise((resolve) => {
    setTimeout(() => resolve('aaaa'), 1000);
  });
}

export default function Home() {

  // const [data] = createResource<string>(delay);

  // console.log(data)

  return (
    <main class={css({bg: 'red.500'})}>
      <Title>Hello World111</Title>
      {/* <h1>Hello world!111 {data()}</h1> */}
      <Counter />
    </main>
  );
}
