import React,{useState} from "react";
import { NavLink } from "./NavLink";
import { Icon } from "@iconify/react";
import cartIcon from "@iconify/icons-akar-icons/cart";
import styles from './Navbar.module.scss'
import LoginModal from "../../Modals/LoginModal";
const Navbar = ({user,token}) => {
  const [isModalVisible,setIsModalVisible]=useState(false)
  return (
    <nav className={styles.navbar}>
      <LoginModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}/>
      <div className={styles.navbar__logo}>LOGO</div>
      <ul className={styles.navbar__list}>
        <li>
          <NavLink href="/" exact className={`${styles.navbar__list_item}`}>
            HOME
          </NavLink>
        </li>
        <li>
          <NavLink href="/services" className={`${styles.navbar__list_item}`}>
            SERVICES
          </NavLink>
        </li>
        <li>
          <NavLink href="/shop" className={styles.navbar__list_item}>
            SHOP
          </NavLink>
        </li>
        <li>
          <NavLink href="/about-us" className={styles.navbar__list_item}>
            ABOUT US
          </NavLink>
        </li>
        <li>
          <NavLink href="/contact" className={styles.navbar__list_item}>
            CONTACT
          </NavLink>
        </li>
        <li>
          <NavLink href="/cart" className={`${styles.navbar__list_item} ${styles.cart}`}>
            <Icon icon={cartIcon} width="30" />
            <span className={styles.cart__count}>2</span>
          </NavLink>
        </li>
        <li>
          {!token?<button onClick={()=>setIsModalVisible(true)} className={styles.navbar__login}>LOGIN</button>:<div className={styles.navbar__user}>{user.name[0].toUpperCase()}</div>}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
