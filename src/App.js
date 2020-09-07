import React, {Component} from 'react';
import './App.css';

import Skybox from './pages/Skybox.js';

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            page : 'skybox'
        }
    }
    render(){

        const {page} = this.state;
        return(
            <>
                <nav id="main_nav">
                    <a
                        style={page == 'skybox' && {opacity: 1}}
                        onClick={e=>this.changePage('skybox')}
                    >THREE.JS (SKYBOX)</a>
                </nav>
                { page == 'skybox' && <Skybox />}
            </>
        )
    }
}

export default App;
