import React, { Component } from 'react';
import '../../../App.css';
import { List, Avatar, Button, Spin, Menu, Icon, Divider } from 'antd';
import { Row, Col } from 'antd';
import {
  BrowserRouter as Router,
  Route,
  Link,
  withRouter
} from 'react-router-dom'

import reqwest from 'reqwest';
import {getAllCampaigns} from '../../../ethereum/store';
const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';

class Campaigns extends Component {
  state = {
    loading: true,
    loadingMore: false,
    showLoadingMore: true,
    data: [],
    list:[]
  }
  componentDidMount() {
    this.getData((res) => {
      this.setState({
        data: res.results,
      });
    });

    getAllCampaigns(this.props.web3).then((some) => {
      Promise.all(some).then((campaigns) => {
        console.log("campsign", campaigns)
        this.setState({
          list: campaigns,
          loading: false,
        });
      })      
    })
  }

  getData = (callback) => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: (res) => {
        callback(res);
      },
    });
  }
  onLoadMore = () => {
    this.setState({
      loadingMore: true,
    });
    this.getData((res) => {
      const data = this.state.data.concat(res.results);
      this.setState({
        data,
        loadingMore: false,
      }, () => {
        window.dispatchEvent(new Event('resize'));
      });
    });
  }
  render() {
    const { loading, loadingMore, showLoadingMore, list } = this.state;
    const loadMore = showLoadingMore ? (
      <div style={{ textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px' }}>
        {loadingMore && <Spin />}
        {!loadingMore && <Button onClick={this.onLoadMore}>loading more</Button>}
      </div>
    ) : null;
    return (
      <div>
        <Row type="flex" justify="center">
        <Col xs={20} sm={16} md={12} lg={18} xl={12}>
        <div>
          <br />
        <h2>Working campaigns
        <Button style={{float: "right", display: "flex"}} 
        onClick={() => this.props.history.push({ pathname: `/add/campaign/`, web3 : this.props.web3})}
        >Add Campaign</Button>
        </h2>
        <Divider ></Divider>
          <List
            className="demo-loadmore-list"
            loading={loading}
            itemLayout="horizontal"
            loadMore={loadMore}
            dataSource={list}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                  title={<a 
                  onClick={() => this.props.history.push({ pathname: `/campaigns/${item.address}`, web3 : this.props.web3})}                  
                  >{item.address}</a>}
                  description={`${item.name}`}
                />
              </List.Item>
            )}
          />
      </div>
        </Col>
      </Row>
      </div>
    );
  }
}


export default withRouter(Campaigns);
