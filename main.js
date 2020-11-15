import './styles.css';
import {Select} from './src/select.js';

const selectInstance = new Select( '.select', {
    selectedId: '',
    placeholder: 'Select item',
    data: [
        {id: 1, value: 'React'},
        {id: 2, value: 'Angular'},
        {id: 3, value: 'View'},
        {id: 4, value: 'React Native'},
        {id: 5, value: 'Jquery'}
    ],
    onSelect(item) {
        console.log('Selected item:', item);
    }
    
});