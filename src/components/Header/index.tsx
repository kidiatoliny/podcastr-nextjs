import styles from "./styles.module.scss";
import pt from 'date-fns/locale/pt'
import { format } from "date-fns";

export function Header(){
  const currentDate = format(new Date(), 'EEEE, d MMMM',{
    locale:pt
  })
  return(
    <header className={styles.container}>
      <img src="/logo.svg" alt="Podcastr"/>
      <p>O melhor par ouvir, sempre</p>
      <span>{currentDate}</span>
    </header>
  )
}