import re
import math
import random
import os
import datetime
import pytz

global_variables = {}

TIMEZONE_ABBREVIATIONS = {
    'PST': 'US/Pacific',
    'EST': 'US/Eastern',
    'MST': 'US/Mountain',
    'PDT': 'US/Pacific',
    'EDT': 'US/Eastern',
    'MDT': 'US/Mountain',
    'IST': 'Asia/Kolkata',
    'BST': 'Europe/London',
    'EET': 'Africa/Cairo',
    'JST': 'Asia/Tokyo',
    'AEST': 'Australia/Sydney',
    'NZST': 'Pacific/Auckland',
    'ACDT': 'Australia/Adelaide',
    'AKST': 'US/Alaska',
    'ART': 'America/Argentina/Buenos_Aires',
    'AST': 'America/Anchorage',
    'AT': 'Africa/Abidjan',
    'BNT': 'Asia/Brunei',
    'BOT': 'America/La_Paz',
    'BRST': 'Brazil/West',
    'BRT': 'Brazil/East',
    'CDT': 'America/Chicago',
    'CET': 'Europe/Zurich',
    'COT': 'America/Bogota',
    'CST': 'Asia/Shanghai',
    'DFT': 'Europe/Berlin',
    'EAT': 'Africa/Nairobi',
    'ECT': 'America/Ecuador',
    'EDT': 'America/New_York',
    'EET': 'Africa/Cairo',
    'FET': 'Europe/Minsk',
    'GAMT': 'Pacific/Gambier',
    'GST': 'Asia/Dubai',
    'HST': 'US/Hawaii',
    'IST': 'Asia/Kolkata',
    'JST': 'Asia/Tokyo',
    'KST': 'Asia/Seoul',
    'LST': 'Africa/Luanda',
    'MET': 'Europe/Paris',
    'NDT': 'Canada/Newfoundland',
    'NET': 'Asia/Tashkent',
    'NFT': 'Pacific/Marquesas',
    'NPT': 'Asia/Kathmandu',
    'PDT': 'US/Pacific',
    'PET': 'America/Lima',
    'PHT': 'Asia/Manila',
    'PKT': 'Asia/Karachi',
    'PMDT': 'America/Manaus',
    'PST': 'US/Pacific',
    'QYZT': 'Asia/Qyzylorda',
    'RET': 'Indian/Reunion',
    'SAST': 'Africa/Johannesburg',
    'SBT': 'Pacific/Guadalcanal',
    'SCT': 'Indian/Mahe',
    'SLT': 'Asia/Colombo',
    'TKT': 'Pacific/Funafuti',
    'TLT': 'Asia/Dili',
    'TMT': 'Asia/Ashgabat',
    'TST': 'Asia/Dushanbe',
    'UTC': 'UTC',
    'UZT': 'Asia/Samarkand',
    'WAKT': 'Pacific/Wallis',
    'WAST': 'Africa/Algiers',
    'WET': 'Europe/Lisbon',
    'WITA': 'Australia/Perth',
    'WST': 'Asia/Jakarta',
}


def execute_custom_code(code):
    local_variables = {}
    functions = {}
    lists = {}

    def custom_eval(expression):
        try:
            return eval(expression, {
                **globals(),
                **global_variables,
                **local_variables,
                **lists
            })
        except Exception as e:
            return f"Error: {str(e)}"

    lines = code.strip().split("\n")
    for line in lines:
        line = line.strip()

        if line.startswith("SET"):
            match = re.match(r'SET (\w+) TO (.+)', line)
            if match:
                var_name, value = match.groups()
                global_variables[var_name] = custom_eval(value)

        elif line.startswith("SHOW"):
            match = re.match(r'SHOW (.+)', line)
            if match:
                expression = match.group(1)
                print(custom_eval(expression))

        elif line.startswith("IF"):
            match = re.match(r'IF (.+) THEN (.+) ELSE (.+)', line)
            if match:
                condition, true_block, false_block = match.groups()
                if custom_eval(condition):
                    execute_custom_code(true_block)
                else:
                    execute_custom_code(false_block)

        elif line.startswith("WHILE"):
            match = re.match(r'WHILE (.+) THEN (.+)', line)
            if match:
                condition, body = match.groups()
                while custom_eval(condition):
                    execute_custom_code(body)

        elif line.startswith("DEF"):
            match = re.match(r'DEF (\w+)\((.*?)\) AS (.+)', line)
            if match:
                func_name, params, body = match.groups()
                functions[func_name] = (params.split(","), body)

        elif line.startswith("CALL"):
            match = re.match(r'CALL (\w+)\((.*?)\)', line)
            if match:
                func_name, args = match.groups()
                if func_name in functions:
                    param_names, body = functions[func_name]
                    local_vars = dict(zip(param_names, args.split(",")))
                    local_variables.update(local_vars)
                    execute_custom_code(body)

        elif line.startswith("TRY"):
            match = re.match(r'TRY (.+) CATCH (.+) THEN (.+)', line)
            if match:
                try_block, error_type, catch_block = match.groups()
                try:
                    execute_custom_code(try_block)
                except Exception as e:
                    if error_type in str(type(e)):
                        execute_custom_code(catch_block)

        elif line.startswith("IMPORT"):
            match = re.match(r'IMPORT (\w+)', line)
            if match:
                module_name = match.group(1)
                try:
                    global_variables[module_name] = __import__(module_name)
                except ModuleNotFoundError:
                    print(f"Error: Module {module_name} not found")

        elif line.startswith("OPEN"):
            match = re.match(r'OPEN (.+) AS (\w+)', line)
            if match:
                filename, var_name = match.groups()
                if os.path.exists(filename):
                    with open(filename, 'r') as file:
                        global_variables[var_name] = file.read()
                        print(global_variables[var_name])
                else:
                    print(f"Error: File '{filename}' not found.")

        elif line.startswith("WRITE TO"):
            match = re.match(r'WRITE TO (.+) (.+)', line)
            if match:
                filename, content = match.groups()
                try:
                    with open(filename, 'w') as f:
                        f.write(custom_eval(content))
                        print(f"Successfully wrote to {filename}")
                except Exception as e:
                    print(f"Error: {str(e)}")

        elif line.startswith("APPEND TO"):
            match = re.match(r'APPEND TO (.+) (.+)', line)
            if match:
                filename, content = match.groups()
                try:
                    with open(filename, 'a') as f:
                        f.write(str(custom_eval(content)))
                        print(f"Successfully appended to {filename}")
                except Exception as e:
                    print(f"Error: {str(e)}")

        elif line.startswith("DELETE FILE"):
            match = re.match(r'DELETE FILE (.+)', line)
            if match:
                filename = match.group(1)
                try:
                    os.remove(filename)
                    print(f"Successfully deleted {filename}")
                except Exception as e:
                    print(f"Error: {str(e)}")

        elif line.startswith("RENAME FILE"):
            match = re.match(r'RENAME FILE (.+) TO (.+)', line)
            if match:
                old_name, new_name = match.groups()
                try:
                    os.rename(old_name, new_name)
                    print(f"Successfully renamed {old_name} to {new_name}")
                except Exception as e:
                    print(f"Error: {str(e)}")

        elif line.startswith("CREATE DIRECTORY"):
            match = re.match(r'CREATE DIRECTORY (.+)', line)
            if match:
                dir_name = match.group(1)
                try:
                    os.makedirs(dir_name, exist_ok=True)
                    print(f"Successfully created directory {dir_name}")
                except Exception as e:
                    print(f"Error: {str(e)}")

        elif line.startswith("DATE NOW"):
            match = re.match(r'DATE NOW (\w+)', line)
            if match:
                tz = match.group(1)
                tz = TIMEZONE_ABBREVIATIONS.get(tz, tz)
                try:
                    timezone = pytz.timezone(tz)
                    local_time = datetime.datetime.now(timezone)
                    print(f"Time in {tz}: {local_time}")
                except pytz.UnknownTimeZoneError:
                    print(f"Error: Timezone '{tz}' not recognized.")
            else:
                gmt_time = datetime.datetime.now(pytz.utc)
                print(f"GMT Time: {gmt_time}")

        elif line.startswith("RAND"):
            match = re.match(r'RAND INT (\d+)? TO (\d+)?', line)
            if match:
                min_val = int(match.group(1)) if match.group(1) else 0
                max_val = int(match.group(2)) if match.group(2) else 100
                rand_value = random.randint(min_val, max_val)
                return rand_value

            match_float = re.match(r'RAND FLOAT (\d+)? TO (\d+)?', line)
            if match_float:
                min_val = float(
                    match_float.group(1)) if match_float.group(1) else 0
                max_val = float(
                    match_float.group(2)) if match_float.group(2) else 100
                rand_value = random.uniform(min_val, max_val)
                return rand_value

        elif line.startswith("LOG"):
            match = re.match(r'LOG \((\d+)\)(?: \((\d+)\))?', line)
            if match:
                number = int(match.group(1))
                base = int(match.group(2)) if match.group(2) else 10
                log_value = math.log(number, base)
                return log_value

        elif line.startswith("POWER"):
            match = re.match(r'POWER (\d+) TO (\d+)', line)
            if match:
                base, exponent = map(int, match.groups())
                power_value = base**exponent
                return power_value

        elif line.startswith("CREATE LIST"):
            match = re.match(r'CREATE LIST (\w+)', line)
            if match:
                list_name = match.group(1)
                lists[list_name] = []

        elif line.startswith("APPEND TO"):
            match = re.match(r'APPEND TO (\w+) (.+)', line)
            if match:
                list_name, value = match.groups()
                lists[list_name].append(custom_eval(value))

        elif line.startswith("REMOVE FROM"):
            match = re.match(r'REMOVE FROM (\w+) (.+)', line)
            if match:
                list_name, value = match.groups()
                lists[list_name].remove(custom_eval(value))

        elif line.startswith("LENGTH OF"):
            match = re.match(r'LENGTH OF (\w+)', line)
            if match:
                list_name = match.group(1)
                print(len(lists.get(list_name, [])))

        elif line.startswith("CLEAR LIST"):
            match = re.match(r'CLEAR LIST (\w+)', line)
            if match:
                list_name = match.group(1)
                lists[list_name].clear()
                print(f"List {list_name} cleared.")

        else:
            print(f"Invalid syntax: {line}")


def main():
    print("Welcome to the Elixir Interpreter")
    print(
        "Use commands like SET x TO 5, SHOW x, IF (something) THEN (this) ELSE (that), WHILE (something) THEN (something else)"
    )
    print(
        "Elixir also has TRY/CATCH, IMPORT modules, OPEN/WRITE/APPEND files, CREATE/APPEND LIST, DATE NOW, RANDOM numbers, LOG, POWER, and more!"
    )
    print(
        "For full documentation, visit: https://github.com/ayaangrover/elixir (and leave a star if you like it!)"
    )
    print("At any time you can type 'EXIT' to quit.")
    while True:
        code = input(">>> ").strip()
        if code.upper() == "EXIT":
            break
        execute_custom_code(code)


if __name__ == "__main__":
    main()
