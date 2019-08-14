import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, minus, asyncAdd } from './action'

import './index.less'

const mapStateToProps = (state) => {
  return {
    counter: state.index.num
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    add: () => {
      dispatch(add())
    },
    asyncAdd: () => {
      dispatch(asyncAdd({ timeout: 3000 }))
    },
    minus: () => {
      dispatch(minus())
    }
  }
}

@connect(mapStateToProps, mapDispatchToProps)
class Index extends Component {

    config = {
    navigationBarTitleText: '首页'
  }

  componentWillReceiveProps (nextProps) {
    // console.log(this.props, nextProps)
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Button className='add_btn' onClick={this.props.add}>+</Button>
        <Button className='dec_btn' onClick={this.props.minus}>-</Button>
        <Button className='dec_btn' onClick={this.props.asyncAdd}>async</Button>
        <View><Text>{this.props.counter}</Text></View>
        <View><Text>Hello, Redux-saga</Text></View>
      </View>
    )
  }
}

export default Index
