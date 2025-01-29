import re
import random
import math

class PotionInterpreter:
    def __init__(self):
        self.variables = {}
        self.output = []
        self.repeat_stack = []
        self.loop_stack = []
        self.function_defs = {} 
        self.is_bottled = False
        self.recipe_name = None
        self.in_function_def = False
        self.conditional_blocks = []
        self.current_function = None
    
    def set(self, identifier, value):
        if isinstance(identifier, str) and identifier.startswith('"') and identifier.endswith('"'):
            identifier = identifier[1:-1]
        self.variables[identifier] = value
        print(f"Set {identifier} to {value}")

    def execute_command(self, line):
        if line.startswith("Say"):
            message = line[4:].strip().strip('"')
            if message in self.variables:
                message = str(self.variables[message])
            self.output.append(message)
            print(f"Output: {self.output}")
        elif line.startswith("Set"):
            parts = line.split("=", 1)
            identifier = parts[0].strip()[4:].strip()
            value = self.evaluate_expression(parts[1].strip())
            self.set(identifier, value)
        elif line.startswith("Add"):
            parts = line.split()
            var1 = self.evaluate_expression(parts[1])
            var2 = self.evaluate_expression(parts[2])
            result = var1 + var2
            self.output.append(f"{var1} + {var2} = {result}")
            print(f"Output: {self.output}")
        elif line.startswith("Subtract"):
            parts = line.split()
            var1 = self.evaluate_expression(parts[1])
            var2 = self.evaluate_expression(parts[2])
            result = var1 - var2
            self.output.append(f"{var1} - {var2} = {result}")
            print(f"Output: {self.output}")
        elif line.startswith("Multiply"):
            parts = line.split()
            var1 = self.evaluate_expression(parts[1])
            var2 = self.evaluate_expression(parts[2])
            result = var1 * var2
            self.output.append(f"{var1} * {var2} = {result}")
            print(f"Output: {self.output}")
        elif line.startswith("Divide"):
            parts = line.split()
            var1 = self.evaluate_expression(parts[1])
            var2 = self.evaluate_expression(parts[2])
            if var2 == 0:
                raise ValueError("Division by zero is not allowed")
            result = var1 / var2
            self.output.append(f"{var1} / {var2} = {result}")
            print(f"Output: {self.output}")
        elif line.startswith("Array"):
            parts = line.split("=", 1)
            identifier = parts[0].strip()[6:].strip()
            elements = parts[1].strip()[1:-1].split(",")
            elements = [self.evaluate_expression(e.strip()) for e in elements]
            self.set(identifier, elements)
        elif line.startswith("Dict"):
            parts = line.split("=", 1)
            identifier = parts[0].strip()[5:].strip()
            elements = parts[1].strip()[1:-1].split(",")
            dict_elements = {}
            for element in elements:
                key, value = element.split(":")
                dict_elements[self.evaluate_expression(key.strip())] = self.evaluate_expression(value.strip())
            self.set(identifier, dict_elements)
        elif line.startswith("RandomAssign"):
            parts = line.split()
            array_name = parts[1]
            groups = parts[2:]
            if array_name not in self.variables:
                raise ValueError(f"Unknown array: {array_name}")
            array = self.variables[array_name]
            random.shuffle(array)
            group_size = len(array) // len(groups)
            for i, group in enumerate(groups):
                self.set(group, array[i*group_size:(i+1)*group_size])

    def evaluate_expression(self, expr):
        expr = expr.strip()
        if expr.isdigit(): 
            return int(expr)
        if expr.startswith('"') and expr.endswith('"'):
            return expr[1:-1]
        if expr in self.variables: 
            return self.variables[expr]
        
        parts = expr.split()
        if len(parts) == 3:
            var1 = self.evaluate_expression(parts[0])
            op = parts[1]
            var2 = self.evaluate_expression(parts[2])
            
            if op == "Add":
                return var1 + var2
            elif op == "Subtract":
                return var1 - var2
            elif op == "Multiply":
                return var1 * var2
            elif op == "Divide":
                if var2 == 0:
                    raise ValueError("Division by zero is not allowed")
                return var1 / var2
            elif op == "Modulus":
                return var1 % var2
            elif op == "Power":
                return var1 ** var2
            elif op == ">":
                return var1 > var2
            elif op == "<":
                return var1 < var2
            elif op == "==":
                return var1 == var2
            elif op == ">=":
                return var1 >= var2
            elif op == "<=":
                return var1 <= var2
            elif op == "!=":
                return var1 != var2
        raise ValueError(f"Unknown variable or value: {expr}")

    def handle_repeat(self, repeat_count, block_lines):
        print(f"Handling Repeat: {repeat_count} iterations. Block: {block_lines}")
        for i in range(repeat_count):
            self.output.append(f"--- Repeat Iteration {i + 1} ---")
            for line in block_lines:
                self.process_line(line)

    def handle_loop(self, loop_count, block_lines):
        print(f"Handling Loop: {loop_count} iterations. Block: {block_lines}")
        for i in range(loop_count):
            self.variables['i'] = i + 1
            for line in block_lines:
                self.process_line(line)

    def handle_function(self, func_name, block_lines):
        self.function_defs[func_name] = block_lines
        print(f"Defined function {func_name}")

    def call_function(self, func_name):
        if func_name not in self.function_defs:
            raise ValueError(f"Unknown function: {func_name}")
        for line in self.function_defs[func_name]:
            self.process_line(line)

    def process_conditional_block(self, line):
        if line.startswith("If"):
            condition = line[3:].strip()
            result = self.evaluate_expression(condition)
            self.conditional_blocks.append({
                'type': 'if',
                'condition_met': result,
                'any_condition_met': result
            })
            print(f"Started If block with condition {condition}, result: {result}")
            return True
            
        elif line.startswith("Else If"):
            if not self.conditional_blocks:
                raise ValueError("Else If without If")
            current_block = self.conditional_blocks[-1]
            if not current_block['any_condition_met']:
                condition = line[8:].strip()
                result = self.evaluate_expression(condition)
                current_block['condition_met'] = result
                current_block['any_condition_met'] = result
                print(f"Started Else If block with condition {condition}, result: {result}")
            else:
                current_block['condition_met'] = False
            return True
            
        elif line == "Else":
            if not self.conditional_blocks:
                raise ValueError("Else without If")
            current_block = self.conditional_blocks[-1]
            current_block['condition_met'] = not current_block['any_condition_met']
            print(f"Started Else block, condition_met: {current_block['condition_met']}")
            return True
            
        elif line == "End If":
            if not self.conditional_blocks:
                raise ValueError("End If without If")
            self.conditional_blocks.pop()
            print("Ended If block")
            return True
            
        return False

    def should_execute_line(self):
        if not self.conditional_blocks:
            return True
        return self.conditional_blocks[-1]['condition_met']

    def process_line(self, line):
        line = line.strip()
        print(f"Processing: {line}")  

        if not line or line.startswith("#"):
            return

        if self.repeat_stack:
            if line == "End Repeat":
                repeat_count, block_lines = self.repeat_stack.pop()
                self.handle_repeat(repeat_count, block_lines)
            else:
                print(f"Inside Repeat Block. Current stack: {self.repeat_stack}")
                self.repeat_stack[-1][1].append(line)
            return

        if self.loop_stack:
            if line == "End Loop":
                loop_count, block_lines = self.loop_stack.pop()
                self.handle_loop(loop_count, block_lines)
            else:
                print(f"Inside Loop Block. Current stack: {self.loop_stack}")
                self.loop_stack[-1][1].append(line)
            return

        if self.in_function_def:
            if line == "End Function":
                self.in_function_def = False
                print(f"Ended Function block")
            else:
                self.function_defs[self.current_function].append(line)
            return

        if self.process_conditional_block(line):
            return

        if not self.should_execute_line():
            return

        if line.startswith("Begin Making"):
            self.recipe_name = line[len("Begin Making"):].strip()
            print(f"Started making {self.recipe_name}")
        elif line.startswith("Finish Making"):
            if self.recipe_name != line[len("Finish Making"):].strip():
                raise ValueError("Recipe name mismatch")
            print(f"Finished making {self.recipe_name}")
        elif line.startswith("Bottle Potion"):
            if self.recipe_name != line[len("Bottle Potion"):].strip():
                raise ValueError("Recipe name mismatch")
            self.is_bottled = True
            print(f"Bottled {self.recipe_name}")
        elif line.startswith("Repeat"):
            parts = line.split()
            repeat_count = int(parts[1])
            self.repeat_stack.append((repeat_count, []))
            print(f"Started Repeat block with count {repeat_count}. Stack: {self.repeat_stack}")
        elif line.startswith("Loop"):
            parts = line.split()
            loop_count = int(parts[1])
            self.loop_stack.append((loop_count, []))
            print(f"Started Loop block with count {loop_count}. Stack: {self.loop_stack}")
        elif line.startswith("While"):
            parts = line.split(" ", 1)
            condition = parts[1]
            self.loop_stack.append((condition, []))
            print(f"Started While loop with condition {condition}. Stack: {self.loop_stack}")
        elif line.startswith("End While"):
            condition, block_lines = self.loop_stack.pop()
            while self.evaluate_expression(condition):
                for line in block_lines:
                    self.process_line(line)
        elif line.startswith("Function"):
            parts = line.split()
            func_name = parts[1]
            self.function_defs[func_name] = []
            self.current_function = func_name
            self.in_function_def = True
            print(f"Started Function block for {func_name}")
        elif line.startswith("Call"):
            parts = line.split()
            func_name = parts[1]
            self.call_function(func_name)
        elif line.startswith("ReadFile"):
            parts = line.split()
            filename = parts[1].strip('"')
            with open(filename, 'r') as file:
                content = file.read()
            self.output.append(content)
            print(f"Read file {filename}")
        elif line.startswith("WriteFile"):
            parts = line.split()
            filename = parts[1].strip('"')
            content = " ".join(parts[2:])
            with open(filename, 'w') as file:
                file.write(content)
            print(f"Wrote to file {filename}")
        else:
            self.execute_command(line)

    def run(self, code):
        for line in code.splitlines():
            self.process_line(line)
        if self.is_bottled:
            return self.output
        else:
            return ["Potion not bottled yet"]

def main():
    with open("main.eli", "r") as file:
        code = file.read()
    
    interpreter = PotionInterpreter()
    output = interpreter.run(code)

    with open("output.txt", "w") as file:
        file.write("\n".join(output))

if __name__ == "__main__":
    main()