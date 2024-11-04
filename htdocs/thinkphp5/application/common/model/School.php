<?php
namespace app\common\model;
use think\Model;

class School extends Model
{
    // 学校表
    protected $table = 'school';
    // 定义主键
    protected $pk = 'id';

    // 关联clazz表
    public function clazz()
    {
        return $this->belongsTo('Clazz');
    }

    // 关联term表
    public function term()
    {
        return $this->belongsTo('Term');
    }
}

