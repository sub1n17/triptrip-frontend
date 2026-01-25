'use client';

import NavigationPc from './pc';
import NavigationMob from './mobile';
import style from './styles.module.css';

export default function Navigation() {
    return (
        <>
            <div className={style.pcNav}>
                <NavigationPc></NavigationPc>
            </div>
            <div className={style.mobNav}>
                <NavigationMob></NavigationMob>
            </div>
        </>
    );
}
