import resource
import sys
from datetime import datetime

# Set CPU time limit to 2 seconds
resource.setrlimit(resource.RLIMIT_CPU, (2, 2))

# Set memory limit to 256MB
resource.setrlimit(resource.RLIMIT_AS, (256 * 1024 * 1024, 256 * 1024 * 1024))

# Example code that will be limited
print("Starting a task that will consume resources...")

try:
    while True:
        sys.stdout.flush()  # Flush the stdout buffer
        pass  # Infinite loop to consume CPU time
except KeyboardInterrupt:
    print("Code terminated by user")
except MemoryError:
    print("Code terminated due to memory limit reached")
except Exception as e:
    print(f"Exception occurred: {e}")
finally:
    print("Finished task")



import os

print(os.cpu_count())