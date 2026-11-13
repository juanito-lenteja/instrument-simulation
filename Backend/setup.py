import os
import subprocess
import sys

def main():
    beroot = os.path.dirname(__file__)
    reqsPath = os.path.join(beroot, 'requirements.txt')
    assert os.path.exists(reqsPath), f'requirements.txt not detected: {reqsPath}'

    try:
        output = subprocess.check_output([sys.executable, '-m', 'pip', 'install', '-r', reqsPath], text=True)
        print(output)
        print("\n  Successfully installed requirements!\n")
    except subprocess.CalledProcessError as e:
        print("")
        print(f"Error installing requirements: {e}")
        print(f"run (from {beroot}):\n\tpip install -r requirements.txt")

if __name__ == '__main__':
    main()
