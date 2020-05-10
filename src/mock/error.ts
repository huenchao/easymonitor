export default {
    "code": "200",
    "data": {
        "error_info": {
            "app_info": {
                "192.168.43.23": [
                    {
                      "app_name": "uwsgi",
                      "error_flag": 1
                    },
                    {
                      "app_name": "tomcat",
                      "error_flag": 1
                    },
                    {
                      "app_name": "abc",
                      "error_flag": 1
                    }
                  ],
            },
            "cpu_info": [{
                    "192.168.0.103": [{
                            "cpu_rate": 0.83,
                            "update_time": "2020-05-01 10:12:37"
                        },
                        {
                            "cpu_rate": 0.22,
                            "update_time": "2020-05-01 10:13:37"
                        },
                        {
                            "cpu_rate": 0.23,
                            "update_time": "2020-05-01 10:14:37"
                        },
                        {
                            "cpu_rate": 0.33,
                            "update_time": "2020-05-01 10:15:37"
                        },
                        {
                            "cpu_rate": 0.3,
                            "update_time": "2020-05-01 10:17:23"
                        },
                        {
                            "cpu_rate": 0.26,
                            "update_time": "2020-05-01 10:19:07"
                        },
                    ]
                },
                {
                    "192.168.80.132": [{
                            "cpu_rate": 0.93,
                            "update_time": "2020-05-01 10:12:37"
                        },
                        {
                            "cpu_rate": 0.22,
                            "update_time": "2020-05-01 10:13:37"
                        },
                        {
                            "cpu_rate": 0.23,
                            "update_time": "2020-05-01 10:14:37"
                        },
                        {
                            "cpu_rate": 0.93,
                            "update_time": "2020-05-01 10:15:37"
                        },
                        {
                            "cpu_rate": 0.91,
                            "update_time": "2020-05-01 10:17:23"
                        },
                    ]
                },
            ],
            "disk_info": {
                "192.168.0.103": [{
                        "disk_rate": 0.99,
                        "file_name": "D:\\",
                        "update_time": "2020-05-02 10:15:03"
                    },
                    {
                        "disk_rate": 0.88,
                        "file_name": "C:\\",
                        "update_time": "2020-05-02 10:24:03"
                    }
                ],
                "192.168.80.130": [{
                        "disk_rate": 0.96,
                        "file_name": "C:\\",
                        "update_time": "2020-05-01 14:06:54"
                    },
                    {
                        "disk_rate": 0.86,
                        "file_name": "D:\\",
                        "update_time": "2020-05-01 18:39:03"
                    }
                ]
            },
            "swap_info": {
                "192.168.0.103": [{
                        "swap_in": 0,
                        "swap_out": 3333,
                        "update_time": "2020-05-02 09:42:03"
                    },
                    {
                        "swap_in": 123,
                        "swap_out": 345,
                        "update_time": "2020-05-02 09:45:03"
                    }
                ],
                "192.168.43.123": [{
                    "swap_in": 2222,
                    "swap_out": 123,
                    "update_time": "2020-05-02 10:27:03"
                }],
                "192.168.80.130": [{
                    "swap_in": 0,
                    "swap_out": 1111,
                    "update_time": "2020-05-02 09:40:03"
                }]
            }
        }

    },
    "msg": "成功"
}