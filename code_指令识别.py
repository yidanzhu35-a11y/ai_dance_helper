import re
from difflib import SequenceMatcher

class DanceCommandProcessor:
    def __init__(self):
        # 核心语料库：标准指令到执行参数的映射（唯一）
        self.command_intents = {
            "播放": {"action": "play"},
            "暂停": {"action": "pause"}, 
            "回到开头": {"action": "seek_to_start"},
            "快进": {"action": "fast_forward", "seconds": 10},
            "快退": {"action": "fast_backward", "seconds": 10},
            "慢速": {"action": "set_speed", "speed": 0.7},
            "正常速度": {"action": "set_speed", "speed": 1.0},
            "零点七倍速": {"action": "set_speed", "speed": 0.7},
            "零点八倍速": {"action": "set_speed", "speed": 0.8},
            "零点九倍速": {"action": "set_speed", "speed": 0.9},
            "一点一倍速": {"action": "set_speed", "speed": 1.1},
            "一点二倍速": {"action": "set_speed", "speed": 1.2},
            "循环这个八拍": {"action": "loop_eight_beat"},
        }
        
        # 映射字典：用户各种说法映射到标准指令（充分覆盖）
        self.keyword_intent_map = {
            # 播放相关
            '播放': '播放', '开始': '播放', '继续': '播放', '开始播放': '播放',
            '继续播放': '播放', '开工': '播放', '启动': '播放', '放吧': '播放',
            
            # 暂停相关
            '暂停': '暂停', '停下': '暂停', '停一下': '暂停', '暂停一下': '暂停',
            '停止': '暂停', '停': '暂停', '等等': '暂停', '暂停播放': '暂停',
            
            # 回到开头
            '回到开头': '回到开头', '重新开始': '回到开头', '回到起点': '回到开头',
            '从头开始': '回到开头', '回到最初': '回到开头', '重头来': '回到开头',
            '再来一遍': '回到开头',
            
            # 快进相关
            '快进': '快进', '快进十秒': '快进', '往后': '快进', '前进': '快进',
            '向后': '快进', '往后一点': '快进', '往后跳': '快进', '往后挪': '快进',
            
            # 快退相关  
            '快退': '快退', '快退十秒': '快退', '往前': '快退', '后退': '快退',
            '向前': '快退', '往前一点': '快退', '往前跳': '快退', '往前挪': '快退',
            '退回去': '快退',
            
            # 慢速相关
            '慢速': '慢速', '慢一点': '慢速', '半速': '慢速', '零点五倍速': '慢速',
            '减速': '慢速', '放慢': '慢速', '慢速播放': '慢速',
            
            # 正常速度相关
            '正常速度': '正常速度', '原速': '正常速度', '一倍速': '正常速度',
            '正常': '正常速度', '常速': '正常速度', '恢复正常': '正常速度',
            
            # 一点五倍速相关
            '一点五倍速': '一点五倍速', '一点五倍': '一点五倍速', '一点五': '一点五倍速',
            
            # 循环相关
            '循环这个八拍': '循环这个八拍', '循环播放': '循环这个八拍', 
            '单曲循环': '循环这个八拍', '循环': '循环这个八拍', '重复': '循环这个八拍',
            '重复播放': '循环这个八拍', '锁定这个八拍': '循环这个八拍',
        }

    def process_command(self, user_command):
        print(f"[指令处理器] 收到指令: \"{user_command}\"")
        
        # 步骤1: 精确匹配
        if user_command in self.command_intents:
            result = self.command_intents[user_command].copy()
            print(f"  -> 执行: {result['action']}")
            return result
        
        # 步骤2: 模糊匹配
        matched_intent, match_type = self._find_best_match(user_command)
        if matched_intent:
            result = self.command_intents[matched_intent].copy()
            # 只在模糊匹配时显示ratio
            if "fuzzy" in match_type:
                print(f"  -> 执行: {result['action']} (相似度: {match_type})")
            else:
                print(f"  -> 执行: {result['action']}")
            return result
        
        # 步骤3: 完全无法理解
        print(f"  -> [静默忽略] 无法理解的指令")
        return None
    
    def _find_best_match(self, command):
        """通过关键词相似度找到最可能的指令。"""
        # 方法1: 关键词匹配
        for keyword, intent in self.keyword_intent_map.items():
            if keyword in command:
                return intent, "keyword"
        
        # 方法2: 字符串相似度匹配
        best_ratio = 0
        best_command = None
        for known_command in self.command_intents.keys():
            ratio = SequenceMatcher(None, command, known_command).ratio()
            if ratio > best_ratio:
                best_ratio = ratio
                best_command = known_command
        
        if best_ratio > 0.6:
            return best_command, f"{best_ratio:.2f}"
        
        return None, None
    
# 测试代码

def run_tests():
    processor = DanceCommandProcessor()
    
    print("开始测试舞蹈指令处理器")
    
    # 测试用例：精确匹配
    print("\n1. 精确匹配测试:")
    exact_commands = ["播放", "暂停", "快进", "快退", "回到开头", "慢速", "正常速度", "循环这个八拍"]
    for cmd in exact_commands:
        print(f"指令: '{cmd}'")
        result = processor.process_command(cmd)
        print(f"结果: {result['action'] if result else '无操作'}")

    # 测试用例：关键词匹配
    print("\n2. 关键词匹配测试:")
    keyword_commands = [
        "开始播放", "继续播放", "停下", "暂停一下", 
        "往后一点", "前进", "往前跳", "重新开始",
        "慢一点", "半速", "原速", "一倍速", "循环播放", "重复"
    ]
    for cmd in keyword_commands:
        print(f"指令: '{cmd}'")
        result = processor.process_command(cmd)
        print(f"结果: {result['action'] if result else '无操作'}")

    # 测试用例：相似度匹配
    print("\n3. 相似度匹配测试:")
    fuzzy_commands = ["播", "暂停一下", "快", "循环", "放", "回头"]
    for cmd in fuzzy_commands:
        print(f"指令: '{cmd}'")
        result = processor.process_command(cmd)
        print(f"结果: {result['action'] if result else '无操作'}")

    # 测试用例：无法理解的指令
    print("\n4. 无法理解指令测试:")
    unknown_commands = ["今天天气真好", "帮我叫外卖", "这是什么", "", "快进十五秒", "加速"]
    for cmd in unknown_commands:
        print(f"指令: '{cmd}'")
        result = processor.process_command(cmd)
        print(f"结果: {result['action'] if result else '无操作'}")
        print("-" * 30)

# 运行测试
if __name__ == "__main__":
    run_tests()
