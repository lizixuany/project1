<?php
namespace app\common\model;
use think\Model;

class My extends Model
{
    // 我的课程表
    protected $table = 'lesson';

    // 关联course表
    public function course()
    {
        return $this->belongsTo('Course', 'course_id', 'id');
    }

    // 关联user表
    public function user()
    {
        return $this->belongsTo('User');
    }
}

