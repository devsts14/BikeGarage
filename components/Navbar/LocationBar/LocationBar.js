import React from "react";
import { Icon } from "@iconify/react";
import locationFilled from "@iconify/icons-carbon/location-filled";
import styles from "./LocationBar.module.scss";

const LocationBar = () => {
  return (
    <div className={styles.locationBar}>
      <div className={styles.locationBar__location}>
        <Icon icon={locationFilled} width="30" height="30" />
        <p>Itpl main road,bangalore,575007 (2.3kms from the shop)</p>
      </div>
      <div className={styles.locationBar__pickupAndDrop}>
          <p>Pickup and drop charges</p>
      </div>
    </div>
  );
};

export default LocationBar;
