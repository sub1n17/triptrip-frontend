import TravelProductBest from '@/components/travelProduct-best';
import TravelProductList from '@/components/travelProduct-list';
import style from './styles.module.css';
import TravelProductRecentPc from '@/components/travelProduct-recent/pc';
export default function travelProductPage() {
    return (
        <div className={style.container}>
            <TravelProductBest></TravelProductBest>
            <TravelProductList></TravelProductList>
            <TravelProductRecentPc></TravelProductRecentPc>
        </div>
    );
}
